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
    bands = Band.where(:set_time => day).includes(:songs)

    songs = []
    bands.each { |band| songs.concat(band.songs) }

    songs.select! { |song| !song.disliked?(user) }

    p = Playlist.new(:name => name, :user_id => user.id)
    p.songs = songs.shuffle![0..20]
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