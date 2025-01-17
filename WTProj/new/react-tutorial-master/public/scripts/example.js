var Comment = React.createClass({
  rawMarkup: function() {
    var md = new Remarkable();
    var rawMarkup = md.render(this.props.children.toString());
    return { __html: rawMarkup };
  },
 range: function(start, end) {
  let nums = [];
  for (let i = start; i < end; i++) nums.push(i);
  return nums;
},
  render: function() {
    var name = this.props['author'];

    let nums = this.range(0, this.props.rating);
    const stars1 =  nums.map(i => (
        <span className="fa fa-star" style={{'color':'orange'}}/>
        ));

//    console.log("props", this.props);
    return (
    <div className="media mb-3">
              <img
                className="mr-3 bg-light rounded"
                width="48"
                height="48"
                src={`https://api.adorable.io/avatars/48/${name.toLowerCase()}@adorable.io.png`}
                alt={name}
              />

              <div className = "media-body p-2 shadow-sm rounded bg-light border">
                    <h2 className="commentAuthor">
                      {this.props.author}
                    </h2>
                    <div className="row">
                      <div className="col-sm-6"> <span dangerouslySetInnerHTML={this.rawMarkup()} /> </div>
                      {stars1}
                    </div>
              </div>
    </div>

    );
  }
});

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    var rest = getRest();
    console.error("comment box", rest)
    $.ajax({
      url: this.props.url+"/"+rest,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
        console.warn(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    // Optimistically set an id on the new comment. It will be replaced by an
    // id generated by the server. In a production application you would likely
    // not use Date.now() for this and would have a more robust system in place.
    comment.id = Date.now();
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url+"/"+rest,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: comments});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
      <CommentForm onCommentSubmit={this.handleCommentSubmit} />
        <h1 >Comments</h1>
        <CommentList data={this.state.data} />
      </div>
    );
  }
});
var Intro = React.createClass({
    getInitialState: function() {
    return {desc: '',
        image:''};
     },
     render: function()
     { console.log(this);
//        var desc = getDesc(rest);
//        console.log("in intro desc",desc);
    $.ajax({
      url: "/api/desc/"+rest,
      dataType: 'json',
      cache: false,
      success: function(data) {
        console.log("in intro" , data);
        var desc = data[0];
        console.log("in intro success",data[1]);
        this.setState({desc: data[0], image:data[1]});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
     return (<div><div className="col-sm-6">
              <img src={"./"+this.state.image} style={{"margin-bottom":'25px'}} />
            </div><div className="col-sm-6" style={{"color":"white"}}>
              <h3>{rest}</h3>
               <p>{this.state.desc}
                </p>
      </div></div>);
      }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment author={comment.author} rating={comment.rating} key={comment.id}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

function getRest()
{
    var filename = $('#myscript').attr("rest");
    return filename;
}

var Description = React.createClass({
    fun: function(){
    var filename = $('#myscript').attr("rest");
    console.log(filename);},
    render : function() { return (<div>{this.fun()} </div>);}
});

var CommentForm = React.createClass({
  check5: function() { if(this.state.color5=="orange") {this.setState({color1:"orange", color2:"orange",color3:"orange",color4:"orange",color5: 'black', rating:4})}
                         else {this.setState({color1:"orange", color2:"orange",color3:"orange",color4:"orange", color5: 'orange', rating:5})}
                       },
  check4: function() { if(this.state.color4=="orange") {this.setState({color1:"orange", color2:"orange",color3:"orange",color4: 'black',color5:'black' ,rating:3})}
                         else {this.setState({color1:"orange", color2:"orange",color3:"orange",color4: 'orange',color5:'black', rating:4})}
                       },
  check3: function() { if(this.state.color3=="orange") {this.setState({color1:"orange", color2:"orange", color3: 'black',color4: 'black',color5:'black' , rating:2})}
                         else {this.setState({color1:"orange", color2:"orange",color3: 'orange', color4:'black',color5:'black', rating:3})}
                       },
  check2: function() { if(this.state.color2=="orange") {this.setState({color1:"orange", color2: 'black', color3: 'black',color4: 'black',color5:'black', rating:1})}
                        else {this.setState({color1:"orange",color2:'orange', color3:'black',color4:'black',color5:'black', rating:2})}
                       },
  check1: function() { if(this.state.color1=="orange") {this.setState({color1: 'black',color2: 'black', color3: 'black',color4: 'black',color5:'black', rating:0})}
                         else {this.setState({color1: 'orange', color2:'black', color3:'black',color4:'black',color5:'black',rating:1})}
                       },

  getInitialState: function() {
    return {author: '', text: '', rating:0};
  },
  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    var rating = this.state.rating
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text, rating:rating});
    this.setState({author: '', text: '', rating:0,color1: 'black',color2: 'black',color3: 'black',color4: 'black',color5: 'black'});
  },
  render: function() {
    return (
      <div>
      <h1> Comment below </h1>

      <form className="form-group" onSubmit={this.handleSubmit}>
        <input
          type="text"
          className="form-control m-3"
          placeholder="Your name"
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />
        <input
          type="text"
          className="form-control m-3"
          placeholder="Say something..."
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <div className="row">
        <h3 className="col-sm-6"> Rating</h3>
        <div className="col-sm-6">
                            <span onClick={this.check1} className="fa fa-star" style={{'color':this.state.color1}}></span>
                            <span onClick={this.check2} className="fa fa-star" style={{'color':this.state.color2}}></span>
                            <span onClick={this.check3} className="fa fa-star" style={{'color':this.state.color3}}></span>
                            <span onClick={this.check4} className="fa fa-star" style={{'color':this.state.color4}}></span>
                            <span onClick={this.check5} className="fa fa-star" style={{'color':this.state.color5}}></span>
        </div>
        </div>
        <input type="submit" className="m-3" value="Post" />

      </form>
    </div>
    );
  }
});

ReactDOM.render(
  <div>
    <div className="App container bg-dark shadow p-5" style={{"marginTop":"10px"}}>
      <div className = "row">
            <Intro url="/api/desc"/>

        </div>
      </div>
    <div className="App container pt-5">
      <CommentBox url="/api/comments" pollInterval={2000} />
    </div>
</div>

  ,
  document.getElementById('content')
);
