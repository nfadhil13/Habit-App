import NewHabitForm from "./(_lib)/components/NewHabitForm";

export default function NewHabitPage() {
  return (
    <section>
      <div className="flex flex-col items-center justify-center h-screen sm:px-14 md:px-12  ">
        <div className="w-full rounded-lg shadow-lg sm:bg-base-200   h-screen sm:h-fit">
          <div className="p-8">
            <h1 className="text-xl font-bold  mb-4">Create New Habit</h1>
            <NewHabitForm />
          </div>
        </div>
      </div>
    </section>
  );
}
