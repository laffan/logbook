
// -----------------------------------------------
// LOGBOOK VIEWER - v1
// -----------------------------------------------


var Logbook = React.createClass({

  getInitialState: function(){
    return {
      navData:[],
      navShow : {
        years : [],
        months : [],
        locations : [],
        days: []
      },
      current : {
        id : [],
        year : [],
        month : [],
        location : [],
        day: []
      }
     };
  },


  componentWillMount: function() {
    this.loadNav();
  },

  setCurrent: function(current){
    this.setState({ current: current });
  },

  setNav: function(){

    // When a particular day has been selected, find the appropriate
    // array for years/months/days to display this.state.navShow
    // and update state.

    var currentYear = parseInt(this.state.current.year);
    var currentMonth = parseInt(this.state.current.month);
    var currentLocation = this.state.current.location;

    var newMonths = _.findWhere(this.state.navData, {'year' : currentYear }).months
    var newLocations = _.findWhere( newMonths , {'month': currentMonth }).locations;
    var newDays = _.findWhere( newLocations , {'location': currentLocation }).days;

    this.setState({
      navShow : {
            years: this.state.navData,
            months: newMonths,
            locations: newLocations,
            days: newDays
          }
     });
  },

  findMostRecent: function(level, value){

    /*
      set state for everythign below stated level.
      ie. if level = 'month' and value = 3, then
          set state for most recent entry in month 3,
          using existing current.year.
    */

    var t = this,
        data = this.state.navData,
        cur = this.state.current;

    function findYears(){
      t.state.navShow.years = data;
    }

    function findMonths(){
      t.state.navShow.months = _.findWhere(data, {'year':value}).months
      cur.month = t.state.navShow.months[ t.state.navShow.months.length - 1 ].month;
    }

    function findLocations(){
      t.state.navShow.locations = _.findWhere( t.state.navShow.months , {'month': cur.month }).locations;
      cur.location = t.state.navShow.locations[ t.state.navShow.locations.length - 1 ].location;
    }

    function findDays(){
      t.state.navShow.days = _.findWhere( t.state.navShow.locations , {'location': cur.location }).days;
      cur.day = t.state.navShow.days[ t.state.navShow.days.length - 1 ].day;
    }

    switch (level) {
      case "year":

        cur.year = value;

        findYears();
        findMonths();
        findLocations();
        findDays();

        break;

      case "month":
        cur.month = value;
        findLocations();
        findDays();
        break;

      case "location":
        cur.location = value;
        findDays();
        break;

      case "day":
        cur.day = value;
        break;

      default:

    }

    this.setState({ current:cur });

  },

  loadNav: function(){

    $.ajax({
      url: this.props.navUrl,
      dataType: 'json',
      success: function(data)
      {
        this.setState({ navData:data });
        // send most recent year to date finder
        this.findMostRecent('year', data[ (data.length - 1) ].year);
      }.bind(this),
      error: function(xhr, status, err){
      }.bind(this)
    });

  },

  loadPrevNext: function(direction){
    var data = {
      'entry' : this.state.current,
      'direction' : direction
    };

    $.ajax({
      url: this.props.prevNextURL,
      dataType: 'json',
      type: 'POST',
      data: data,
      success: function(data){

        // add location string to the data object so it can be read by
        // the nav's active state;

        data.location = data.city + ', ' + data.country;

        this.setState({ current:data });
        this.setNav();

      }.bind(this),
      error: function(xhr, status, err){
        console.log(xhr);
      }.bind(this)
    });
  },

  render : function() {
    return (
      <div>
        <h1>Logbook</h1>
        <p>
          Current : Day : {this.state.current.day} | Month : {this.state.current.month} | Year :  {this.state.current.year} | Location :  {this.state.current.location}
        </p>
        <hr></hr>
        <Nav
          navData={this.state.navData}
          navShow={this.state.navShow}
          current={this.state.current}
          setCurrent={this.setCurrent}
          findMostRecent={this.findMostRecent}
          />

        <hr/>

        <PrevNext
          prevNextURL={this.props.prevNextURL}
          loadPrevNext={this.loadPrevNext}
          current={this.state.current}
          />

        <hr/>

        <Entry
          entryUrl={this.props.entryUrl}
          setCurrentID={this.setCurrentID}
          current={this.state.current}
        />
      </div>
    );
  }
});

var PrevNext = React.createClass({

  sendDirection(direction){
    this.props.loadPrevNext(direction)
  },

  findPrevNext: function(direction){
    this.props.loadPrevNext(direction);
  },

  render : function() {
    return (
      <div>
        <h4
          className='prevNext'
          onClick={this.sendDirection.bind(this, 'prev')}
          >Prev</h4>
        <h4
          className='prevNext'
          onClick={this.sendDirection.bind(this, 'next')}
          >Next</h4>

        <div className='u-clearboth'></div>

      </div>
    );
  }
});

var Entry = React.createClass({

  getInitialState: function(){
    return {
      entryData : []
     };
  },

  componentWillReceiveProps: function() {
      this.loadEntry();
  },

  loadEntry: function(){

    var dataObj = {
      'year' : this.props.current.year,
      'month' : this.props.current.month,
      'day' : this.props.current.day
    };

    $.ajax({
      url: this.props.entryUrl,
      type: 'POST',
      data: dataObj,
      dataType: 'json',
      success: function(data){
          this.setState({ entryData:data });

      }.bind(this),
      error: function(xhr, status, err){
      }.bind(this)
    });
  },

  renderTemplate: function(entry) {
    return(
      <div hasClass="entry" key={entry.id}>
        <p>{entry.id}</p>
        <p>{entry.city}, {entry.country}</p>
        <p>{entry.day} - {entry.month} - {entry.year}</p>
        <p dangerouslySetInnerHTML={{__html: entry.description}} />
      </div>
    )
  },

  render : function() {
    var entries = this.state.entryData.map(this.renderTemplate);
    return (
      <div>
        {entries}
      </div>
    );
  }

});

var Nav = React.createClass({

  setCurrent: function(){
    this.props.setCurrent(this);
  },

  render : function() {
    return (
      <div>

        <h2>Years</h2>
        <NavList
          type = 'year'
          data = {this.props.navShow.years}
          current = {this.props.current.year}
          findMostRecent = {this.props.findMostRecent}
          />

        <div className='u-clearboth'></div>

        <h2>Months</h2>
        <NavList
          type = 'month'
          data = {this.props.navShow.months}
          current = {this.props.current.month}
          findMostRecent = {this.props.findMostRecent}
          />

        <div className='u-clearboth'></div>

        <h2>Locations</h2>
        <NavList
          type = 'location'
          data = {this.props.navShow.locations}
          current = {this.props.current.location}
          findMostRecent = {this.props.findMostRecent}
          />

        <div className='u-clearboth'></div>

        <h2>Days</h2>
        <NavList
          type = 'day'
          data = {this.props.navShow.days}
          current = {this.props.current.day}
          findMostRecent = {this.props.findMostRecent}
          />

        <div className='u-clearboth'></div>

      </div>
    );

  }
});

var NavList = React.createClass({

  findMostRecent: function(item){
    var type = this.props.type;
    this.props.findMostRecent(type, item[type]);
  },

  renderTemplate: function(item){
    var type = this.props.type;

    // check to make sure you're comparing strings to strings and
    // ints to ints

    if ( type === 'location') {
      var active = (this.props.current === item[type]) ? 'active' : null;
    } else {
      var active = ( parseInt(this.props.current) === parseInt(item[type])) ? 'active' : null;
    }

    return (
      <li
        className= {active}
        key= {item[type]}
        onClick={this.findMostRecent.bind(this, item)}
        >{item[type]}</li>
    );
  },

  render : function() {
    var items = this.props.data.map(this.renderTemplate)
    return (
      <ul className='navList' >
        {items}
      </ul>
    );
  }
});

React.render(
  <Logbook
    navUrl="ajax/get-nav.php"
    entryUrl="ajax/get-entry.php"
    prevNextURL="ajax/get-prevnext.php"
  />,
  document.getElementById('content')
);
