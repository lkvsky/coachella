class SongsController < ApplicationController
  def index
    songs = Song.random_selection.map { |song| song.formatted_json }

    respond_to do |format|
      format.json { render :json => songs }
    end
  end
end
