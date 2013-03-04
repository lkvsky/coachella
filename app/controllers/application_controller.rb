class ApplicationController < ActionController::Base
  protect_from_forgery

  def current_or_guest_user
    if current_user
      if session[:guest_user_id]
        guest_user.destroy
        session[:guest_user_id] = nil
      end

      current_user
    else
      guest_user
    end
  end

  def guest_user
    User.find(session[:guest_user_id] ||= create_guest_user.id)

    rescue ActiveRecord::RecordNotFound
      session[:guest_user_id] = nil
      guest_user
  end

  private

  def create_guest_user
    u = User.create(:username => "guest",
                    :email => "guest_#{Time.now.to_i}#{rand(99)}@example.com")
    u.save(:validate => false)
    session[:guest_user_id] = u.id
    u
  end
end
