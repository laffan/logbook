// LOGBOOK VIEWER - v1
// -----------------------------------------------


var Logbook = React.createClass({displayName: "Logbook",

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
      React.createElement("div", null,
        React.createElement("div", {className: "Logbook-Nav"},

          React.createElement("div", {className: "Logbook-Nav-Header"},
            React.createElement("h1", null, "The", React.createElement("br", null), "Logbook"),
            React.createElement("span", {className: "meta"}, aboutString)
          ),

        React.createElement(Nav, {
          navData: this.state.navData,
          navShow: this.state.navShow,
          current: this.state.current,
          setCurrent: this.setCurrent,
          findMostRecent: this.findMostRecent}
          ),

        React.createElement(PrevNext, {
          prevNextURL: this.props.prevNextURL,
          loadPrevNext: this.loadPrevNext,
          current: this.state.current}
          )
        ),
        React.createElement("div", {className: "Logbook-Content"},

        React.createElement(Entry, {
          entryData: this.state.entryData}
        )
      )

      )
    );
  }
});

var PrevNext = React.createClass({displayName: "PrevNext",

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
      React.createElement("div", null,
        React.createElement("div", {
          className: "Logbook-Prev",
          onClick: this.sendDirection.bind(this, 'prev')
          }),
        React.createElement("div", {
          className: "Logbook-Next",
          onClick: this.sendDirection.bind(this, 'next')
          }),

        React.createElement("div", {className: "u-clearboth"})

      )
    );
  }
});

var Entry = React.createClass({displayName: "Entry",

  getLink: function(entry){
    var extras = { };
    if (entry.album) {
      extras.href = entry.album;
      extras.target = '_blank';
      return React.createElement("a", React.__spread({},  extras));
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
      React.createElement("div", {key: entry.id},
        React.createElement("div", {className: "Logbook-Content-Header"},
          // React.createElement("div", {className: "Logbook-photoLink"}, this.getLink(entry)), 
          React.createElement("div", {className: "meta"}, date),
          React.createElement("p", null, entry.city, ", ", entry.country)
        ),
        React.createElement("div", {className: "Logbook-Content-Entry"},
          React.createElement("p", {dangerouslySetInnerHTML: {__html: entry.description}})
        )
      )
    )
  },

  render : function() {
    var entries = this.props.entryData.map(this.renderTemplate);
    return (
      React.createElement("div", null,
        entries
      )
    );
  }

});

var Nav = React.createClass({displayName: "Nav",

  setCurrent: function(){
    this.props.setCurrent(this);
  },

  render : function() {
    return (
      React.createElement("div", {className: "Nav"},

        React.createElement(NavList, {
          type: "year",
          data: this.props.navShow.years,
          current: this.props.current.year,
          findMostRecent: this.props.findMostRecent}
          ),

        React.createElement("div", {className: "u-clearboth"}),

        React.createElement(NavList, {
          type: "month",
          data: this.props.navShow.months,
          current: this.props.current.month,
          findMostRecent: this.props.findMostRecent}
          ),

          React.createElement("div", {className: "u-clearboth"}),

        React.createElement(NavList, {
          type: "location",
          data: this.props.navShow.locations,
          current: this.props.current.location,
          findMostRecent: this.props.findMostRecent}
          ),

          React.createElement("div", {className: "u-clearboth"}),

        React.createElement(NavList, {
          type: "day",
          data: this.props.navShow.days,
          current: this.props.current.day,
          findMostRecent: this.props.findMostRecent}
          ),

          React.createElement("div", {className: "u-clearboth"})

      )
    );

  }
});

var NavList = React.createClass({displayName: "NavList",

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
      React.createElement("li", {
        className: active,
        key: item[type],
        onClick: this.findMostRecent.bind(this, item)
        }, displayItem)
    );
  },

  render : function() {
    var items = this.props.data.map(this.renderTemplate)
    return (
      React.createElement("ul", {className: "navList"},
        items
      )
    );
  }
});

React.render(
  React.createElement(Logbook, {
    navUrl: "ajax/get-nav.php",
    entryUrl: "ajax/get-entry.php",
    prevNextURL: "ajax/get-prevnext.php"}
  ),
  document.getElementById('LogbookContent')
);
