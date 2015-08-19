// LOGBOOK ADMIN - v1
// -----------------------------------------------

var LogbookAdmin = React.createClass({displayName: "LogbookAdmin",

  getInitialState: function(){
    return {data:[]};
  },

  showAlert: function(msg, timeout){

    $('.alert').remove();
    $('<div class="alert">'+ msg + '</div>')
      .prependTo('body')
      .delay(timeout)
      .fadeOut('slow', function(){
          $(this).remove();
      });
  },

  loadEntriesFromServer: function(){
    $.ajax({
      url: this.props.getEntriesURL,
      dataType: 'json',
      success: function(data){
        this.setState({ data:data });
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  handleEntrySubmit: function(entry){
    $.ajax({
      url: this.props.addEntryURL,
      dataType: 'json',
      type: 'POST',
      data: entry,
      success: function(data){
        this.showAlert('entry saved!', 2000);
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  handleEntryDelete: function(entry){

    $.ajax({
      url: this.props.deleteEntryURL,
      dataType: 'json',
      type: 'POST',
      data: {'id' : entry.id },
      success: function(data){
        this.showAlert('entry deleted', 2000);
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },

  handleEntryUpdate: function(update){
    this.showAlert('entry saving', 99999);

    console.log(update);
    $.ajax({
      url: this.props.updateEntryURL,
      dataType: 'json',
      type: 'POST',
      data: {'update' : update},
      success: function(data){
        this.showAlert('entry ' + update.id + ' ' + update.field + ' updated', 2000);
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },

  componentDidMount: function() {
    this.loadEntriesFromServer();
  },

  render : function(){
    return (
      React.createElement("div", {className: "wrapper"}, 
        React.createElement(EntryForm, {onEntrySubmit: this.handleEntrySubmit}), 

        React.createElement(Entries, {
          data: this.state.data, 
          handleEntryDelete: this.handleEntryDelete, 
          handleEntryUpdate: this.handleEntryUpdate}
          )
      )
    )
  }
});

// ENTRY FORM
// -----------------------------------------------
var EntryForm = React.createClass({displayName: "EntryForm",

  getInitialState: function(){
    return {date:[]};
  },

  updateDate: function(date){
    this.setState({ date: date.value });
  },

  handleSubmit: function(e){

    e.preventDefault();
    var year = this.state.date.year;
    var month = this.state.date.month;
    var day = this.state.date.day;
    var city = React.findDOMNode(this.refs.city).value.trim();
    var country = React.findDOMNode(this.refs.country).value.trim();
    var description = React.findDOMNode(this.refs.description).value.trim();

    if ( !year || !month || !day || !city || !country || !description ) {
      return;
      console.log('missing something');
    }

    this.props.onEntrySubmit({
      year: year,
      month: month,
      day: day,
      city: city,
      country: country,
      description: description
    });

    React.findDOMNode(this.refs.city).value = '';
    React.findDOMNode(this.refs.country).value = '';
    React.findDOMNode(this.refs.description).value = '';

  },

  render: function() {

    var date = moment({
                  years : this.state.date.year,
                  months : this.state.date.month - 1,
                  date : this.state.date.day
                }).format("ddd, MMMM Do YYYY");

    return(
      React.createElement("div", {className: "Entry"}, 

        React.createElement("form", {onSubmit: this.handleSubmit}, 
          React.createElement("div", {className: "Entry-topBar"}, 

            React.createElement(DatePicker, {onDateChange: this.updateDate}, date), 
            React.createElement("input", {type: "text", className: "Entry-city", ref: "city", placeholder: "city"}), 
            React.createElement("input", {type: "text", className: "Entry-country", ref: "country", placeholder: "country"}), 
            React.createElement("div", {className: "u-clearboth"})

          ), 

          React.createElement("textarea", {className: "Entry-description", ref: "description", placeholder: "entry"}), 

          React.createElement("input", {type: "submit", className: "Entry-save", value: "Save"})

        )
      )
    );
  }
});

// ENTRIES
// -----------------------------------------------
var Entries = React.createClass({displayName: "Entries",

  deleteEntry: function(entry){
    if (confirm("Delete Entry #" + entry.id + "?"))
    {
      this.props.handleEntryDelete(entry);
    }
  },

  updateEntry: function(update){
    this.props.handleEntryUpdate(update);
  },

  updateDate: function(update){
    this.props.handleEntryUpdate(update);
  },

  renderTemplate: function(entry){

    var date = moment({
                  years : entry.year,
                  months : entry.month - 1,
                  date : entry.day
                }).format("ddd, MMMM Do YYYY");

    return (
      React.createElement("li", {
        key: entry.id, 
        className: "Entry"
        }, 

        React.createElement("div", {className: "Entry-topBar"}, 

          React.createElement(DatePicker, {
            id: entry.id, 
            onDateChange: this.updateDate
           }, date), 

           React.createElement(EntryField, {className: "Entry-city", id: entry.id, field: "city", 
            html: entry.city, onChange: this.updateEntry}), 

          React.createElement(EntryField, {className: "Entry-country", id: entry.id, field: "country", 
            html: entry.country, onChange: this.updateEntry}), 
          React.createElement("div", {className: "u-clearboth"})
        ), 

        React.createElement(EntryField, {id: entry.id, field: "description", 
          html: entry.description, onChange: this.updateEntry}), 

          React.createElement("button", {
            className: "Entry-delete", 
            onClick: this.deleteEntry.bind(this, entry)
          }, "Delete"), 

        React.createElement("div", {className: "u-clearboth"})


      )
    );
  },

  render : function(){
    var entries = this.props.data.map(this.renderTemplate)
    return (
      React.createElement("div", {className: "EntriesList"}, 
        React.createElement("ul", null, 
          entries
        )
      )
      );
    }

});

// ENTRY FIELD (contentEditable)
// -----------------------------------------------
var EntryField = React.createClass({displayName: "EntryField",

  shouldComponentUpdate: function(nextProps){
    return nextProps.html !== this.getDOMNode().innerHTML;
  },
  emitChange: function(){
    var html = this.getDOMNode().innerHTML;
    if (this.props.onChange && html !== this.lastHtml) {

        this.props.onChange({
            id: this.props.id,
            field: this.props.field,
            value: html
        });
      }
      this.lastHtml = html;
  },
  render: function(){
    var className = "Entry-" + this.props.field;
    return React.createElement("div", {
      className: className, 
      onBlur: this.emitChange, 
      contentEditable: true, 
      dangerouslySetInnerHTML: {__html: this.props.html}});
    },


});

// DATE PICKER
// -----------------------------------------------
var DatePicker = React.createClass({displayName: "DatePicker",

  componentDidMount:  function() {

    var self = this;
    var el = this.getDOMNode();
    var picker = new Pikaday({
      field: el,
      onSelect: function(date) {
        self.props.onDateChange({
            id: self.props.id,
            field: 'date',
            value: {
              year: parseInt(this.getMoment().format('YYYY')),
              month: parseInt(this.getMoment().format('M')),
              day: parseInt(this.getMoment().format('D'))
            }
        });

      }
    })
  },

  render : function() {
    return (
      React.createElement("div", {className: "Entry-datePicker"}, this.props.children)
    );
  }
});


// RENDER
// -----------------------------------------------

React.render(
  React.createElement(LogbookAdmin, {
    getEntriesURL: "ajax/get-entries.php", 
    updateEntryURL: "ajax/update-entry.php", 
    addEntryURL: "ajax/add-entry.php", 
    deleteEntryURL: "ajax/delete-entry.php", 
    updateEntryURL: "ajax/update-entry.php"}
   ),
  document.getElementById('content')
);