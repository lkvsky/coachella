class BandsController < ApplicationController
  def index
    bands = Band.sort_alphabetically[0..10]

    band_json = bands.map do |band|
      { "info" => band, "songs" => band.songs }
    end

    respond_to do |format|
      format.html { redirect_to root_path }
      format.json { render :json => band_json}
    end
  end
end
