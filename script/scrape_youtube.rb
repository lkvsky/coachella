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

    channel = JSON.parse(RestClient.get(url))["feed"]["entry"][0]["yt$channelId"]["$t"]
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

    JSON.parse(RestClient.get(url))["feed"]["entry"].map do |song|
      {
        :band_id => 1,
        :name => song["media$group"]["media$title"]["$t"],
        :url => song["media$group"]["yt$videoid"]["$t"],
        :thumbnail => song["media$group"]["media$thumbnail"][0]["url"]
      }
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
        :max_results => 20
      }
    ).to_s

    JSON.parse(RestClient.get(url))["feed"]["entry"].map do |song|
      {
        :band_id => band.id,
        :name => song["media$group"]["media$title"]["$t"],
        :url => song["media$group"]["yt$videoid"]["$t"],
        :thumbnail => song["media$group"]["media$thumbnail"][0]["url"]
      }
    end
  end

  def store_songs
    @bands.each do |band|
      songs = get_songs_by_band(band)

      band.songs = songs.map { |song| Song.new(song) }

      band.save!
    end
  end
end

scraper = ScrapeYoutube.new
scraper.store_songs





