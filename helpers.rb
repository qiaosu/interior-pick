helpers do
  def path_to script
    #case script
      #when :jquery then 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js'
      #when :rightjs then 'http://cdn.rightjs.org/right-2.3.0.js'
      #when :backbone then 'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.0/backbone-min.js'
      #when :underscore then 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.1/underscore-min.js'
      #moo, prototype, scriptaculous, jquery ui, yui, dojo, raphael, extjs      
      #else "/javascripts/#{script}.js"
    #end
    "/javascripts/#{script}.js"
  end

  def javascripts(*args)
    js = []
    js << settings.javascripts if settings.respond_to?('javascripts')
    js << args
    js << @js if @js
    js.flatten.uniq.map do |script| 
      "<script src=\"#{path_to script}\"></script>"
    end.join
  end

  def js(*args)
    @js ||= []
    @js = args
  end

  def styles(*args)
      css = []
      css << settings.css if settings.respond_to?('css')
      css << args
      css << @css if @css
      css.flatten.uniq.map do |stylesheet| 
        "<link href=\"/stylesheets/#{stylesheet}.css\" media=\"screen, projection\" rel=\"stylesheet\" />"
      end.join    
  end

  def css(*args)
    @css ||= []
    @css += args
  end

end