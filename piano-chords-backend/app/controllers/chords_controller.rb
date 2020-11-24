class ChordsController < ApplicationController
    def index
        chords = Chord.all
        # options = {
        #     include: [:user]
        # }
        render json: ChordSerializer.new(chords)#, options)
    end
end