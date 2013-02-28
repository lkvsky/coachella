class SongLikesController < ApplicationController
  def create
    songId = params[:like]

    like = SongLike.new(:song_id => songId)
    like.save!

    respond_to do |format|
      format.json { render :json => like }
    end
  end

  def destroy
    songId = params[:like]
    # need notion of current user to complete this...
  end
end
