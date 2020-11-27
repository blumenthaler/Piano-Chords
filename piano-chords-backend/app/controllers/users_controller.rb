class UsersController < ApplicationController
    def index
        users = User.all
        options = {
            include: [:chords]
        }
        render json: UserSerializer.new(users, options)
    end
end
