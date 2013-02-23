class Playlist < ActiveRecord::Base
  attr_accessible :user_id, :name
end