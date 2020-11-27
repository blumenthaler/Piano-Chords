class UsersController < ApplicationController
    def index
        users = User.all
        # options = {
        #     include: [:chord]
        # }
        render json: UserSerializer.new(users)#, options)
    end
end
