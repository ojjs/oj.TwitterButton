// oj.TwitterFollowButton

// Load twitter api only once
var _loaded;

// Create plugin
module.exports = function(oj,settings){
  if (typeof settings !== 'object')
    settings = {}

  var TwitterFollowButton = oj.type('TwitterFollowButton', {

    base: oj.View,

    constructor: function(){
      var this_ = this;
      var union = oj.argumentsUnion(arguments);
      var options = union.options;
      var args = union.args;

      // First argument is username
      if(args.length > 0)
        this.username = args[0];

      // Shift properties
      var props = [
        'label',
        'large',
        'showCount',
        'showUsername',
        'username'
      ];
      for (var i = 0; i < props.length; i++) {
        var prop = props[i];
        if (options[prop] != null)
          this[prop] = oj.argumentShift(options, prop);
      }

      // Create el
      this.el = oj(function(){
        var size = null, tailor = null;
        if (this_.large)
          size = {'data-size':'large'};
        if (!this_.showTailoring)
          tailor = {'data-dnt':false};

        oj.a("Follow @" + this_.username, {
            href: 'https://twitter.com/' + this_.username,
            c:'twitter-follow-button',
            'data-show-count':this_.showCount,
            'data-show-screen-name':this_.showUsername,
            style:{display:'none'}
          },
          tailor,
          size
        );
      });

      TwitterFollowButton.base.constructor.apply(this, [options]);

      this.loadTwitterAPI();
    },
    properties: {
      username: 'evanmoran',

      showUsername: true,

      showCount: false,

      showTailoring: true,

      large: false
    },

    methods: {
      loadTwitterAPI:function(){
        var this_ = this;
        if (oj.isClient && !_loaded) {
          var p=/^http:/.test(document.location)?'http':'https';
          $.ajax({
            url: p + '://platform.twitter.com/widgets.js',
            dataType: "script",
            cached: true,
            // Show button once api has been called (avoids flickering)
            complete: function(){this_.$el.show()}
          });
        }
        _loaded = 1;
      }
    }
  });

  return {TwitterFollowButton:TwitterFollowButton};
};
