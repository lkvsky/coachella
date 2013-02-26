class BandsController < ApplicationController
  def index
    @bands = Band.sort_alphabetically
    @songs = Song.random_selection

    respond_to do |format|
      format.html
      format.json { render :json => Song.all }
    end
  end

  def show
    @band = Band.find(params[:id])
    @songs = @band.songs.limit(20).all

    respond_to do |format|
      format.html
      format.json { render :json => @band.songs }
    end
  end
end
