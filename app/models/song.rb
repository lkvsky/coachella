class Song < ActiveRecord::Base
  attr_accessible :name, :band_id, :url, :thumbnail

  belongs_to :band

  has_many :dislikes, :class_name => "SongDislike"
  has_many :likes, :class_name => "SongLike"

  validates :url, :uniqueness => { :scope => :band_id }

  def self.random_selection
    Song.all.shuffle[0..20]
  end
end