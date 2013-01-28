var PicItem = Backbone.Model.extend({
	attributes: {
    src: "",
    description: "",
    date: "",
    w: 0,
    h: 0
  },
  defaults: {
    type: 0,
    size: 0
  },
  initialize: function(d, op){
    if (this.get('h') >= op.h) {this.size = 1;}
    if (this.get('h') >= 800) {this.size = 2;}
  }
});

var PicList = Backbone.Collection.extend({
  model: window.PicItem,
  url: "/request/lanting"
});

var Template = {
  item_tpl : _.template('<div class="template"><div class="p"><div class="tile">' + 
    '<a href="#" class="pic-link"><img src="<%= src%>" class="pic-ph" /></a>' + 
    '<div class="date"><div class="alpha_bg"></div><span><%= date %></span></div>' +
    '<div class="description"><div class="bg"></div><span class="label"><%= description %></span></div>' +
    '</div></div></div>')
};

var ListView = Backbone.View.extend({
  el: $('#content'),
  setting: {
    view: {
      w: $(document).width(),
      h: $(document).height()
    },
    total: 0
  },
  events: {},
  resetView: function(){
    this.setting.view = {
      w: $(window).width(),
      h: $(window).height()
    };
    this.setting.total = 0;
  },
  initialize: function(){
    this.model = new window.PicList();
    this.initData();
    _.bindAll(this);
  },
  initData: function(){
    var _self = this;
    this.model.fetch({
      'success': function(res, status, xhr){
        console.log(res, _self.model.models);
        _self.initView();
      },
      'error': _self.error
    });
  },
  initView: function(){
    var _self = this;
    $(_self.el).empty();
    _.each(this.model.models, function(data){
      console.log(data.attributes);
      var snippet = _self.getTpl(data.attributes, Template.item_tpl);
      console.log(snippet);
      snippet = $(snippet);
      snippet = _self.calulatePos(data, snippet);
      $(_self.el).append(snippet);
    });
    $(_self.el).css('width', _self.setting.total);
  },
  calulatePos: function(data, snippet){
    var _size = this.setting.view;
    var _r_size = {
      h: _size.h - 40,
      w: data.get('w') * (_size.h - 40) / data.get('h')
    };
    snippet.css({
      width: _r_size.w + 40,
      height: _r_size.h + 40
    });
    snippet.find('.tile').css({
      width: _r_size.w,
      height: _r_size.h
    });
    snippet.find('.pic-ph').css({
      width: _r_size.w,
      height: _r_size.h
    });
    this.setting.total += (_r_size.w + 41);
    return snippet;
  },
  getTpl: function(data, type){
    return type(data);
  },
  error: function(msg){}
});

$(document).ready(function(){
  
  var app = new ListView();

  $(window).on('resize', function(e){
    console.log('resize');
    app.resetView();
    app.initView();
  });

});