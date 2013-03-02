class Song < ActiveRecord::Base
  attr_accessible :name, :band_id, :url, :thumbnail

  belongs_to :band

  has_many :dislikes, :class_name => "SongDislike"
  has_many :likes, :class_name => "SongLike"

  validates :url, :uniqueness => { :scope => :band_id }

  def self.random_selection
    Song.all.shuffle[0..20]
  end

  def formatted_json(user)
    band = Band.find(self.band_id)
    {
      :id => self.id,
      :name => self.name,
      :url => self.url,
      :band_thumbnail => band.thumbnail,
      :band => band.name,
      :like => "#{self.liked?(user)}",
      :dislike => "#{self.disliked?(user)}"
    }
  end

  def liked?(user)
    return false if user.favorite_songs.empty?
    user.favorite_songs.include?(self)
  end

  def disliked?(user)
    return false if user.disliked_songs.empty?
    user.disliked_songs.include?(self)
  end
end