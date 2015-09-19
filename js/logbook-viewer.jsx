
// -----------------------------------------------
// LOGBOOK VIEWER - v1
// -----------------------------------------------


var Logbook = React.createClass({

  getInitialState: function(){
    return {
      navData:[],
      entryData : [],
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
        album : [],
        day: []
      }
     };
  },

  componentWillMount: function() {
    this.loadNav();
  },

  componentDidUpdate: function(){

    function positionDateNav(){

       var topMargin = ( $(window).height() - $('.Logbook-Nav').height()) / 2 ;

       if ( topMargin > 10 ) {
         $('.Logbook').css({
           marginTop: topMargin
         });
       }

      $(".navList").each(function(){

        var active = $(this).find('li.active');
        var activePos = active.position();
        var activeOff = active.offset();
        var activeLeft = '';

        if ( activePos ) {

          activePosition = activePos.left;
          activeOffset = activeOff.left;

          var marginAdjust = -activePosition + ( $('.Logbook-Nav').outerWidth() / 2 ) - ( active.outerWidth() / 2 );

          $(this).css({
            marginLeft : marginAdjust - 30 // for padding.
          });
        }

      });
    };


    $(window).bind('resize', function () {
      positionDateNav();
    });


    positionDateNav();



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

    var newMonths = _.findWhere(this.state.navData, {'year' : currentYear }).months;
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

   this.loadEntry();

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
      t.state.navShow.months = _.findWhere(data, {'year':value}).months;
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

    function findID(){
      cur.id = _.findWhere( t.state.navShow.days , {'day': cur.day }).id;
    }

    switch (level) {
      case "year":
        cur.year = value;

        findYears();
        findMonths();
        findLocations();
        findDays();
        findID();

        break;

      case "month":
        cur.month = value;

        findLocations();
        findDays();
        findID();

        break;

      case "location":
        cur.location = value;

        findDays();
        findID();
        break;

      case "day":
        cur.day = value;

        findID();
        break;

      default:

    }

    this.setState({ current:cur });
    this.loadEntry();
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
      'id' : this.state.current.id,
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

        var dataArray = {
          year: parseInt(data.year),
          month: parseInt(data.month),
          day: parseInt(data.day),
          id: parseInt(data.id),
          location: data.city + ', ' + data.country
        };

        this.setState({ current:dataArray });
        this.setNav();

      }.bind(this),
      error: function(xhr, status, err){
        console.log(xhr);
      }.bind(this)
    });
  },

  loadEntry: function(){

    this.setState({ entryData:[] });

    $.ajax({
      url: this.props.entryUrl,
      type: 'POST',
      data: { 'id' : this.state.current.id },
      dataType: 'json',
      success: function(data){

          this.setState({ entryData:data });

      }.bind(this),
      error: function(xhr, status, err){
      }.bind(this)
    });
  },

  render : function() {

    var aboutString = "The Logbook is a short, off-the-cuff account of day-to-day happenings while life feels interesting.";

    return (
      <div>
        <div className="Logbook-Nav">

          <div className="Logbook-Nav-Header">
            <h1>The<br/>Logbook</h1>
            <span className="meta">{aboutString}</span>
          </div>

        <Nav
          navData={this.state.navData}
          navShow={this.state.navShow}
          current={this.state.current}
          setCurrent={this.setCurrent}
          findMostRecent={this.findMostRecent}
          />

        <PrevNext
          prevNextURL={this.props.prevNextURL}
          loadPrevNext={this.loadPrevNext}
          current={this.state.current}
          />
        </div>
        <div className="Logbook-Content">

        <Entry
          entryData={this.state.entryData}
        />
      </div>

      </div>
    );
  }
});

var PrevNext = React.createClass({

  componentDidMount: function() {
    // thanks to changey :  http://stackoverflow.com/questions/29550966/key-binding-in-react-js
    $(document.body).on('keydown', this.handleKeyDown);
  },

  componentWillUnMount: function() {
    $(document.body).off('keydown', this.handleKeyDown);
  },

  handleKeyDown: function(event) {

    if (event.keyCode == 39 /*right*/) {
      this.sendDirection('next');
    }
    if (event.keyCode == 37 /*left*/) {
      this.sendDirection('prev');
    }
  },

  sendDirection: function(direction){
    this.props.loadPrevNext(direction);
  },

  findPrevNext: function(direction){
    this.props.loadPrevNext(direction);
  },

  render : function() {
    return (
      <div>
        <div
          className='Logbook-Prev'
          onClick={this.sendDirection.bind(this, 'prev')}
          ></div>
        <div
          className='Logbook-Next'
          onClick={this.sendDirection.bind(this, 'next')}
          ></div>

        <div className='u-clearboth'></div>

      </div>
    );
  }
});

var Entry = React.createClass({

  getLink: function(entry){
    var extras = { };
    if (entry.album) {
      extras.href = entry.album;
      extras.target = '_blank';
      return <a {...extras} ></a>;
    }
    else {
      return '';
    }
  },

  renderTemplate: function(entry) {

    var date  = moment({
                  years : entry.year,
                  months : entry.month - 1,
                  date : entry.day
                }).format("dddd, MMMM Do YYYY");


    return(
      <div key={entry.id}>
        <div className="Logbook-Content-Header">
          <div className="Logbook-photoLink">{this.getLink(entry)}</div>
          <div className="meta">{date}</div>
          <p>{entry.city}, {entry.country}</p>
        </div>
        <div className="Logbook-Content-Entry">
          <p dangerouslySetInnerHTML={{__html: entry.description}} />
        </div>
      </div>
    )
  },

  render : function() {
    var entries = this.props.entryData.map(this.renderTemplate);
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
      <div className="Nav">

        <NavList
          type = 'year'
          data = {this.props.navShow.years}
          current = {this.props.current.year}
          findMostRecent = {this.props.findMostRecent}
          />

        <div className='u-clearboth'></div>

        <NavList
          type = 'month'
          data = {this.props.navShow.months}
          current = {this.props.current.month}
          findMostRecent = {this.props.findMostRecent}
          />

          <div className='u-clearboth'></div>

        <NavList
          type = 'location'
          data = {this.props.navShow.locations}
          current = {this.props.current.location}
          findMostRecent = {this.props.findMostRecent}
          />

          <div className='u-clearboth'></div>

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
    var displayItem = item[type];
    var active = '';

    // if it's display months, just moment to show the word
   if ( type === 'month' ) {
        var displayItem = moment({ months : (displayItem - 1) }).format("MMMM");
    }

    // check to make sure you're comparing strings to strings and
    // ints to ints
    if ( type === 'location') {
      active = (this.props.current === item[type]) ? 'active' : null;
    } else {
      active = ( parseInt(this.props.current) === parseInt(item[type])) ? 'active' : null;
    }

    return (
      <li
        className= {active}
        key= {item[type]}
        onClick={this.findMostRecent.bind(this, item)}
        >{displayItem}</li>
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
  document.getElementById('LogbookContent')
);
