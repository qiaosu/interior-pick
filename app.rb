require 'rubygems'
require 'json'
require 'haml'
require 'sinatra'
require "debugger"
require 'data_mapper'
require 'dm-mysql-adapter'

enable :sessions

require "./models"
require "./routes"
require "./helpers"