
// -----------------------------------------------
// LOGBOOK ADMIN - v1
// -----------------------------------------------

var LogbookAdmin = React.createClass({

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
      <div className="wrapper">
        <EntryForm onEntrySubmit={this.handleEntrySubmit} />

        <Entries
          data={this.state.data}
          handleEntryDelete = {this.handleEntryDelete}
          handleEntryUpdate = {this.handleEntryUpdate}
          />
      </div>
    )
  }
});

// ENTRY FORM
// -----------------------------------------------
var EntryForm = React.createClass({

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
      <div className="Entry">

        <form onSubmit={this.handleSubmit}>
          <div className="Entry-topBar">

            <DatePicker onDateChange={this.updateDate}>{date}</DatePicker>
            <input type="text" className="Entry-city" ref="city" placeholder="city" />
            <input type="text" className="Entry-country" ref="country" placeholder="country" />
            <div className="u-clearboth"></div>

          </div>

          <textarea className="Entry-description" ref="description" placeholder="entry"></textarea>

          <input type="submit" className="Entry-save" value="Save" />

        </form>
      </div>
    );
  }
});

// ENTRIES
// -----------------------------------------------
var Entries = React.createClass({

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
      <li
        key={entry.id}
        className="Entry"
        >

        <div className="Entry-topBar">

          <DatePicker
            id={entry.id}
            onDateChange={this.updateDate}
           >{date}</DatePicker>

           <EntryField className="Entry-city" id={entry.id} field='city'
            html={entry.city} onChange={this.updateEntry} />

          <EntryField className="Entry-country"  id={entry.id} field='country'
            html={entry.country} onChange={this.updateEntry} />
          <div className="u-clearboth"></div>
        </div>

        <EntryField id={entry.id} field='description'
          html={entry.description} onChange={this.updateEntry} />

          <button
            className="Entry-delete"
            onClick={this.deleteEntry.bind(this, entry)}
          >Delete</button>

        <div className="u-clearboth"></div>


      </li>
    );
  },

  render : function(){
    var entries = this.props.data.map(this.renderTemplate)
    return (
      <div className="EntriesList">
        <ul>
          {entries}
        </ul>
      </div>
      );
    }

});

// ENTRY FIELD (contentEditable)
// -----------------------------------------------
var EntryField = React.createClass({

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
    return <div
      className={className}
      onBlur={this.emitChange}
      contentEditable
      dangerouslySetInnerHTML={{__html: this.props.html}}></div>;
    },


});

// DATE PICKER
// -----------------------------------------------
var DatePicker = React.createClass({

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
      <div className="Entry-datePicker">{this.props.children}</div>
    );
  }
});


// RENDER
// -----------------------------------------------

React.render(
  <LogbookAdmin
    getEntriesURL="ajax/get-entries.php"
    updateEntryURL="ajax/update-entry.php"
    addEntryURL="ajax/add-entry.php"
    deleteEntryURL="ajax/delete-entry.php"
    updateEntryURL="ajax/update-entry.php"
   />,
  document.getElementById('content')
);
