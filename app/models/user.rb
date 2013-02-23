class User < ActiveRecord::Base
  attr_accessible :username

  has_many :likes, :class_name => "SongLike"
  has_many :dislikes, :class_name => "SongDislike"
end