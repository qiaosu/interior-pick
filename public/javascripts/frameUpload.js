/**
 * dep: jQuery
 */
!function(name, definition){
    _[name] = definition();
}("FrameUpload", function(){
    var FrameUpload = _.Klass({
    	attrs: {},
        initialize: function(settings){
            for (var attr in settings) {
            	if (settings.hasOwnProperty(attr)) {
            		this.attrs[attr] = settings[attr];
            	}
        	}

        	this._status = 0;
        	this._cache = {};
        	this._targetForm = $('#j-attach-upload-form');

        	this.beforeCreate();
        	this.bind();
        	this.subscribe();
        	this.check();

        },
        beforeCreate: function(){
        	_.log('beforeCreate, do nothing.')

        	this._cache = {};
        	this._cache.placeholder = $(this.attrs.placeholder);
        	this._cache.btn = $('.j-upload-btn', this._cache.placeholder);
        	this._cache.control = $('.j-filecontrol', this._targetForm);
        	this._cache.explain =  $(".j-explain", this._cache.placeholder);
        	this._cache.container =  $(".j-file-container", this._cache.placeholder);

        	var that = this;
	        setInterval(function(){
	            that.initFileControl();
	        },200);

	        this._targetForm.attr('enctype', 'multipart/form-data');    //firefox
	        this._targetForm.encoding = "multipart/form-data";     //ie
	        this.attrs.postUrl && this._targetForm.attr('action', this.attrs.postUrl);
	        var uniqueId = 'iframeUpload' + _.utils.randStr(8);
	        this._createIframe(uniqueId).appendTo(document.body);
	        this._targetForm.attr('target', uniqueId);
	        this._targetForm.attr('method', 'post');
	 
	 		
	        this.callbackName = this.callbackName || uniqueId;
	        this._getCallbackInput().appendTo(this._targetForm);
	        var that = this;
	        window[this.callbackName] = function() {
	        	_.log('AfterUpload');
	            /*if(that.resetFileInput) {
	                //重置file表单
	                $(':file', that._targetForm).each(function(i,v) {
	                    that.resetFile(v);
	                });
	            }*/
	            //$E.publish('AfterUpload', [].slice.call(arguments));
	        }
        },
        bind: function(){
        	var that = this;
        	$(':file', this._targetForm).each(function(i,v){
	            $(v).on('change', function(e) {
	                that.change(e.target);
	 
	                if(that.autoUpload) {
	                    that.upload();
	                }
	            });
	        });

        	$(this._cache.placeholder).on('click', '.j-cancel-link', this.cancel);
        	$(this._cache.placeholder).on('click', '.j-delete-link', this.deletePic);
        },
        subscribe: function(){

        },
        create: function(){

        },
        check: function(){

        },
        reset: function(){

        },
        change: function(file){
        	this.select(file);
        },
        select: function(file){
        	//检查选择文件是否在allowFileType中
	        var ext = file.value.substr(file.value.lastIndexOf('.') + 1).toLowerCase();
	        if ($.inArray(ext, this.attrs.allowFileType) == -1) {
	            this.error('TYPEERROR');
	        }
	        else {
	            this.upload();
	        }
        },
        cancel: function(){

        },
        deletePic: function(){

        },
        upload: function(){
			this.trigger('BeforeUpload', [this._targetForm]);
			this.updateStatus("uploading");
        	this._targetForm.trigger('submit');
        	//this.trigger('afterUpload', [this._targetForm]);
        },
        complete: function(callback){
        	if (this.status_ == -1) {
	            this.status_ = 0;
	            return;
	        }
	        if (callback.stat == "ok") {
	            this.success(callback);
	        }
	        else {
	            this.onFail(callback);
	        }
        },
        success: function(){

        },
        error: function(type){
        	switch (type) {
        		case 'TYPEERROR':
        			this.msg("请上传" + this.attrs.allowFileType + "类型的文件");
        			break;
        		default:
        			this.msg('系统错误');
        	}
        },
        msg: function(msg){
        	$(this._cache.explain).html(msg);
        },
        initFileControl: function(){
        	//position
        	this._cache.control.css({
        		"left": this._cache.btn.position().left,
        		"top": this._cache.btn.position().top
        	});

        	//size
	        this._cache.control.css({
	            "width": this._cache.btn.outerWidth() + 'px',
	            "height": this._cache.btn.outerHeight() + 'px'
	        });
        },
        updateStatus: function(status){
        	this._targetForm.className = "status-" + status;
	        this._cache.placeholder.className = "status-" + status;
	       
	        this.initFileControl();
        },
        _createIframe: function(id) {
	        if (!this._iframe) {
	            var $iframe = $('<iframe name=' + id + '></iframe>');
	            $iframe.attr('src', 'javascript:""');
	            $iframe.attr('name', id);
	            $iframe.attr('id', id);
	            $iframe.css({'display': 'none'});
	            this._iframe = $iframe;
	        }
	        return this._iframe;
	    },
	    _getCallbackInput: function() {
	        if(!this._callbackInput) {
	            var $input = $('<input type="hidden" name="callbackName" value="' + this.callbackName + '" />');
	            this._callbackInput = $input;
	        }
	        return this._callbackInput;
	    },
        resetFile: function(file){
	        file.value = "";//ff chrome safari
	        if ( file.value ) {
	            if ($.browser.msie) {//ie
	            	/*
	                with(file.parentNode.insertBefore(document.createElement('form'), file)){
	                    appendChild(file); reset(); removeNode(false);
	                }
	                */
	            } else {//opera
	                file.type = "text"; file.type = "file";
	            }
	        }
        }
    });
    _.Events.mixTo(FrameUpload);
    return FrameUpload;
});

_.upload = new _.FrameUpload({
	"form": "#j-upload-form",	//id
    "placeholder": "#j-frame-upload-placeholder",	//id
    "postUrl": "/upload",
    "delUrl": "/photo-delete",
    "resetFileInput": true,
    "allowFileType": ['jpg', 'jpeg', 'png'],
    "autoUpload": false,
    "maxFileCount": 10,
    "uploadedCount": 0
});