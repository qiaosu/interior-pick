=begin

DB = DataMapper.setup(:default, "mysql://kenshin:lx123456@localhost/interior_pick")

class User
  include DataMapper::Resource

  attr_accessor :password, :password_confirmation

  property :id,           Serial
  property :email,        String, :required => true, :unique => true, :format => :email_address
  property :password_hash,Text
  property :password_salt,Text
  property :token,        String
  property :created_at,   DateTime
  property :admin,        Boolean, :default => false

  validates_presence_of         :password
  validates_confirmation_of     :password
  validates_length_of           :password, :min => 6

  has n, :lists 

  after :create do
    self.token = SecureRandom.hex
  end

  def generate_token
    self.update!(:token => SecureRandom.hex)
  end

  def admin?
    self.admin
  end

end

DataMapper.finalize
DataMapper.auto_upgrade!

=end

CarrierWave::SanitizedFile.sanitize_regexp = /[^[:word:]\.\-\+]/

DB = DataMapper.setup(:default, "mysql://kenshin:lx123456@localhost/interior_usb")

class ImageUploader < CarrierWave::Uploader::Base
  def store_dir
    'uploads/usr/'
  end

  def extension_white_list
    %w(jpg jpeg png)
  end

  storage :file
end

class Image
  include DataMapper::Resource

  property :id, Serial

  mount_uploader :file, ImageUploader
end

DataMapper.finalize
DataMapper.auto_upgrade!