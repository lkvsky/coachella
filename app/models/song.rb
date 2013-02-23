class Song < ActiveRecord::Base
  attr_accessible :name, :band_id, :url

  belongs_to :band

  has_many :dislikes, :class_name => "SongDislike"
  has_many :likes, :class_name => "SongLike"
end