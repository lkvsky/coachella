class BandsController < ApplicationController
  def index
    @bands = Band.sort_alphabetically
    @songs = Song.limit(10).all

    respond_to do |format|
      format.html
      format.json { render :json => Song.all }
    end
  end

  def show
    @band = Band.find(params[:id])
    @songs = @band.songs.all

    respond_to do |format|
      format.html
      format.json { render :json => @band.songs }
    end
  end
end
