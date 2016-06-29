class Api::GamesController < ApplicationController
  def index
    @games = Game.all
    render :index
  end

  def create
    @game = Game.create!(game_params)
    render :index
  end

  def edit
    render :show
  end

  def update
    @game = Game.find(params[:id])
    @game.update_attributes(game_params)
    render :update
  end

  def destroy
    @game = Game.find(params[:id])
    @game.destroy
    render :index
  end

  private

  def game_params
    params.require(:game).permit(:user1, :user2, :winner, :comments1, :comments2)
  end
end
