class Band < ActiveRecord::Base
  attr_accessible :name, :genre, :set_time

  has_many :songs
  has_many :dislikes, :through => :songs, :source => :dislikes
  has_many :likes, :through => :songs, :source => :likes
end