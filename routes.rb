get '/' do
  @uploads = Image.all
  haml :index
end

post '/' do
  upload = Image.new
  upload.file = params[:image]
  upload.save
  redirect to('/')
end

get '/upload' do
  js :frameUpload
  @uploads = Image.all
  haml :upload
end

get '/iframeupload/:callback' do
  haml :uploadCallback, :layout => false
end

post '/upload' do
  upload = Image.new
  upload.file = params[:file]
  upload.save
  cb = params[:callbackName]
  redirect to('/iframeupload/'+cb)
end

get '/show/:name' do
  js :underscore, :backbone, :app
  haml :show
end

get '/request/:name' do
  @picData = []
  Dir.glob(File.expand_path("../public/resources/" + params[:name] + "/*.jpg", __FILE__)) do |f|
    @picData << {
      :description => File.basename(f),
      :src => "../resources/" + params[:name] + "/" + File.basename(f),
      :date => File.ctime(f),
      :w => FastImage.size(f)[0],
      :h => FastImage.size(f)[1]
    }
  end
  puts @picData
  @picData.to_json
end