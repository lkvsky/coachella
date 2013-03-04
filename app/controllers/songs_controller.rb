class SongsController < ApplicationController
  def index
    user = current_or_guest_user
    songs = Song.random_selection.map { |song| song.formatted_json(user) }

    respond_to do |format|
      format.json { render :json => songs }
    end
  end
end
