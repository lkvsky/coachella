class ScrapeCoachella
  def initialize
    @page_url = "http://www.coachella.com/lineup/load_lineup?sort=alphabetical&destination=1&view=grid&page=1"
  end

  def get_band_nodes
    page = Nokogiri::HTML(RestClient.get(@page_url))

    page.css('div.artist_overlay_right')
  end

  def parse_name(node)
    node.css('h1').text
  end

  def parse_set_time(node)
    node.children[5].children[3].children[1].text.split("|")[0].split(" ")[0]
  end

  def create_bands(nodes)
    nodes.each do |node|
      Band.create!(:name => parse_name(node), :set_time => parse_set_time(node))
    end
  end

  def get_photos
    page = Nokogiri::HTML(RestClient.get(@page_url))
    nodes = page.css('div.artist_overlay_left')

    thumbnail_hash = {}

    nodes.each do |node|
      name = node.children[1].attributes["title"].value

      thumbnail_hash[name] = node.children[1].attributes["src"].value
    end

    thumbnail_hash
  end

  def store_photos
    photos = get_photos
    bands = Band.all

    bands.each do |band|
      if photos.has_key?(band.name)
        band.thumbnail = photos[band.name]

        band.save!
      end
    end
  end
end

scraper = ScrapeCoachella.new
nodes = scraper.get_band_nodes
scraper.create_bands(nodes)
scraper.store_photos