class UsersController < ApplicationController
    def index
        users = User.all
        options = {
            include: [:chords]
        }
        render json: UserSerializer.new(users, options)
    end

    def create
        user = User.create(
            username: params[:username]
        )
        render json: user
    end
end
