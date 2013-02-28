class PlaylistSongsController < ApplicationController
  def destroy
    song = PlaylistSong.find(params[:id])

    song.destroy
  end
end
