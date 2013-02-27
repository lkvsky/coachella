class Song < ActiveRecord::Base
  attr_accessible :name, :band_id, :url, :thumbnail

  belongs_to :band

  has_many :dislikes, :class_name => "SongDislike"
  has_many :likes, :class_name => "SongLike"

  validates :url, :uniqueness => { :scope => :band_id }

  def self.random_selection
    Song.all.shuffle[0..20]
  end

  def formatted_json
    band = Band.find(self.band_id)
    {
      :id => self.id,
      :name => self.name,
      :url => self.url,
      :band_thumbnail => band.thumbnail,
      :band => band.name
    }
  end
end