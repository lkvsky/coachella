class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def facebook
    if session[:guest_user_id]
      @user = User.find_for_facebook_oauth(request.env['omniauth.auth'], guest_user)
    else
      @user = User.find_for_facebook_oauth(request.env['omniauth.auth'])
    end

    if @user.persisted?
      sign_in_and_redirect @user, :event => :authentication
    else
      redirect_to root_path
      flash[:log_in_error] = "Oops! Someone already has an account with that e-mail."
    end
  end

  private

  def guest_user
    User.find(session[:guest_user_id] ||= create_guest_user.id)

    rescue ActiveRecord::RecordNotFound
      session[:guest_user_id] = nil
      guest_user
  end
end