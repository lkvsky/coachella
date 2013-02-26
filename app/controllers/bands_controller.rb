class BandsController < ApplicationController
  def index
    bands = Band.sort_alphabetically

    respond_to do |format|
      format.html { redirect_to root_path }
      format.json { render :json => bands }
    end
  end

  def show
    band = Band.find(params[:id])

    band_json = { "info" => band, "songs" => band.songs }

    respond_to do |format|
      format.html { redirect_to root_path }
      format.json { render :json => band_json }
    end
  end
end
