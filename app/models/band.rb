class Band < ActiveRecord::Base
  attr_accessible :name, :genre, :set_time, :youtube_channel

  has_many :songs
  has_many :dislikes, :through => :songs, :source => :dislikes
  has_many :likes, :through => :songs, :source => :likes

  validates :name, :uniqueness => true, :presence => true

  def Band.get_by_day(day)
    Band.where(:set_time => day.capitalize!)
  end
end