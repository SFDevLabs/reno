/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const React = require('react');
const ArticleActions = require('../actions/ArticleActions');
const ArticleStore = require('../stores/ArticleStore');
const Messages = require('./Messages.react');
const Actions = require('../actions/ArticleActions');

import { Link } from 'react-router';


/**
 * Retrieve the current ARTICLE data from the ArticleStore
 */
function getState(id) {
  return {
    article: ArticleStore.getById(id)
  };
}

const ArticleSection = React.createClass({

  getInitialState: function() {
    return getState(this.props.params.id);
  },

  componentDidMount: function() {
    if (!this.state.article){
      Actions.getById(this.props.params.id);
    }
    ArticleStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ArticleStore.removeChangeListener(this._onChange);
  },
  /**
   * @return {object}
   */
  render :function() {
    if (!this.state.article){return <div>loading</div>}
    const article = this.state.article;
    const dateString = new Date(article.createdAt).toLocaleString();

    var tags = [];
    for (var i = article.tags.length - 1; i >= 0; i--) {
      tags.push(
        (<span key={i}>
            <i className="muted fa fa-tag"></i>&nbsp;
            <a className="tag"> {article.tags[i]} </a>
         </span>)
      )
    };

    return (
      <section className="container">
        <div className="page-header">
          <h1>{article.title}</h1>
        </div>
        <Messages messages={[{message:"Successfully created article!"}]} type="success" />
        
        <div className="content">
          <div className="row">
            <div className="col-md-8">
              <p>{ article.body }</p>
              <div className="meta">
                  Author: &nbsp;
                  <a href="#">
                    {article.user.username}
                  </a>
                  <p>
                    Tags: &nbsp;
                      {tags}
                      &nbsp;&nbsp;
                  </p>
                <span className="muted">{dateString}</span>
              </div>
            </div>
            <div className="col-md-4">
                <img src="/img/twitter.png" alt="" />
            </div>
          </div>
          <form action="" method="post" onsubmit="return confirm('Are you sure?')">
            <br />
            <input type="hidden" name="_csrf" value="" />
            <Link  to={'/articles/'+article._id+'/edit'} title="edit" className="btn btn-default">
              Edit
            </Link>
            &nbsp;&nbsp;
            <input type="hidden" name="_method" value="DELETE" />
            <button className="btn btn-danger" type="submit">Delete</button>
          </form>
          <Comments comments={article.comments} id={article._id} />

        </div>
      </section>
    )
  },
  /**
   * Event handler for 'change' events coming from the ArticleStore
   */
  _onChange: function() {
    this.setState(getState(this.props.params.id));
  }

});

module.exports = ArticleSection;
