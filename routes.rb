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