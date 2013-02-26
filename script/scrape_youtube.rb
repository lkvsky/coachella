require 'addressable/uri'

class ScrapeYoutube
  def initialize
    @bands = Band.all
  end

  def get_youtube_channel(band)
    url = Addressable::URI.new(
        :scheme => "https",
        :host => "gdata.youtube.com",
        :path => "feeds/api/channels",
        :query_values => {
          :q => band.name,
          :v => 2,
          :alt => "json"
        }
      ).to_s

    response = JSON.parse(RestClient.get(url))["feed"]["entry"]
    if response
      channel = response[0]["yt$channelId"]["$t"]
    end

    band.youtube_channel = channel
    band.save!
  end

  def get_songs_by_channel(band)
    url = Addressable::URI.new(
        :scheme => "https",
        :host => "gdata.youtube.com",
        :path => "feeds/api/videos",
        :query_values => {
          :author => band.youtube_channel,
          :v => 2,
          :alt => "json"
        }
      ).to_s

    begin
      JSON.parse(RestClient.get(url))["feed"]["entry"].map do |song|
        {
          :band_id => 1,
          :name => song["media$group"]["media$title"]["$t"],
          :url => song["media$group"]["yt$videoid"]["$t"],
          :thumbnail => song["media$group"]["media$thumbnail"][0]["url"]
        }
      end
    rescue
      []
    end
  end

  def get_songs_by_band(band)
    url = Addressable::URI.new(
      :scheme => "https",
      :host => "gdata.youtube.com",
      :path => "feeds/api/videos",
      :query_values => {
        :q => band.name,
        :v => 2,
        :alt => "json",
        "max-results" => 20
      }
    ).to_s

    begin
      JSON.parse(RestClient.get(url))["feed"]["entry"].map do |song|
        {
          :band_id => band.id,
          :name => song["media$group"]["media$title"]["$t"],
          :url => song["media$group"]["yt$videoid"]["$t"],
          :thumbnail => song["media$group"]["media$thumbnail"][0]["url"]
        }
      end
    rescue
      []
    end
  end

  def store_youtube_channel
    @bands.each do |band|
      get_youtube_channel(band)
    end
  end

  def store_songs
    @bands.each do |band|
      if band.youtube_channel.nil?
        songs = get_songs_by_band(band)
      else
        songs = get_songs_by_channel(band)
        if songs.empty?
          songs = get_songs_by_band(band)
        end
      end

      band.songs = songs.map { |song| Song.new(song) }

      band.save!
    end
  end
end

scraper = ScrapeYoutube.new
# scraper.store_youtube_channel
scraper.store_songs





