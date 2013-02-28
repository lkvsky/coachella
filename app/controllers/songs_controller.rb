class SongsController < ApplicationController
  def index
    songs = Song.random_selection.map { |song| song.formatted_json(current_user) }

    respond_to do |format|
      format.json { render :json => songs }
    end
  end
end
