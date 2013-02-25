class SongsController < ApplicationController
  def index
    respond_to do |format|
      format.json { render :json => Song.all }
    end
  end
end
