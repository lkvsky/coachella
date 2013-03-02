class Playlist < ActiveRecord::Base
  attr_accessible :user_id, :name

  belongs_to :user

  has_many :playlist_songs, :dependent => :destroy
  has_many :songs, :through => :playlist_songs

  before_create :check_name
  before_save :check_name

  def formatted_json(user)
    formatted_songs = self.songs.map  do |song|
      song.formatted_json(user)
    end

    { :playlist => self, :songs => formatted_songs }
  end

  def self.create_by_day(day, name, user)
    songs = Song.joins(:band).where("bands.set_time = ?", day).select do |song|
      !song.disliked?(user)
    end

    p songs

    p = Playlist.new(:name => name, :user_id => user.id)
    p.songs = songs.shuffle![0..20]
    p.save!
    p
  end

  def self.create_by_bands(bands, name, user)
    songs = []

    bands.each do |band|
      songs.concat(Band.find(band).songs)
    end

    songs.select do |song|
      !song.disliked?(user)
    end.shuffle![0..20]

    p = Playlist.new(:name => name, :user_id => user.id)
    p.songs = songs
    p.save!
    p
  end

  private

    def check_name
      if self.name.nil? || self.name == ""
        t = Time.new.strftime("%m/%d/%Y")
        self.name = "New Playlist #{t}"
      end
    end
end