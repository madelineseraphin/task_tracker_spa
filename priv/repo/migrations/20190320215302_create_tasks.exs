defmodule TaskTracker.Repo.Migrations.CreateTasks do
  use Ecto.Migration

  def change do
    create table(:tasks) do
      add :complete, :boolean, default: false, null: false
      add :description, :string
      add :hours, :float
      add :title, :string, null: false
      add :user_id, references(:users, on_delete: :delete_all)

      timestamps()
    end

    create index(:tasks, [:title], unique: true)

  end
end
