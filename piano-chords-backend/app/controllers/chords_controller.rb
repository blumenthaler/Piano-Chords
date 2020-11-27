class ChordsController < ApplicationController
    def index
        chords = Chord.all
        # options = {
        #     include: [:user]
        # }
        render json: ChordSerializer.new(chords)#, options)
    end

    def create
        chord = Chord.create(
            name: params[:name]
            structure: params[:structure]
            symbols: params[:symbols]
            user: User.find(params[:user_id])
        )
        render json: chord
    end
end