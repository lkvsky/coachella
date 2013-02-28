class SongDislikesController < ApplicationController
  def create
    songId = params[:dislike]

    dislike = SongDislike.new(:song_id => songId)
    dislike.save!

    respond_to do |format|
      format.json { render :json => dislike }
    end
  end

  def destroy
    songId = params[:like]
    # need notion of current user to complete this...
  end
end
