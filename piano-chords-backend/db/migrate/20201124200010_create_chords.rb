class CreateChords < ActiveRecord::Migration[6.0]
  def change
    create_table :chords do |t|
      t.string :name
      t.string :symbols
      t.string :structure

      t.timestamps
    end
  end
end
