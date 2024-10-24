<script setup>
</script>

<template>
  <div class="container-fluid p-0">
    <div class="row g-0 min-vh-100">
      <div class="col-auto pe-3 m-0">
        <div class="sidebar d-flex flex-column flex-shrink-0 p-3 sticky-top bg-body-secondary vh-100">
          <RouterLink class="mb-0 mx-auto text-white text-decoration-none " to="/" activeClass="" exactActiveClass="">
            <span class="fs-4"><abbr title="Decolonizing and Indigenizing STEM">DISTEM</abbr></span>
          </RouterLink>
          <hr>
          <ul class="nav nav-pills flex-column mb-auto">
            <li class="nav-item mb-2">
              <RouterLink class="nav-link text-white" to="/" activeClass="" exactActiveClass="active">
                <i class="bi bi-person-raised-hand"></i>
                Welcome
              </RouterLink>
            </li>
            <li class="nav-item mb-2">
              <RouterLink class="nav-link text-white" to="/design_and_navigation">
                <i class="fa-solid fa-marker"></i>
                Design & Navigation
              </RouterLink>
            </li>
            <li class="nav-item mb-2">
              <RouterLink class="nav-link text-white" to="/project_history">
                <i class="fa-solid fa-timeline"></i>
                Project History
              </RouterLink>
            </li>
            <li class="nav-item mb-2">
              <RouterLink class="nav-link text-white" to="/prototype">
                <i class="fa-solid fa-pen-ruler"></i>
                Prototype
              </RouterLink>
            </li>
            <li class="nav-item mb-2">
              <RouterLink class="nav-link text-white" to="/team">
                <i class="fa-solid fa-people-group"></i>
                DISTEM Team
              </RouterLink>
            </li>
            <li class="nav-item mb-2">
              <RouterLink class="nav-link text-white" to="/acknowledgments">
                <i class="fa-solid fa-thumbs-up"></i>
                Acknowledgments
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
      <main class="col overflow-y-auto p-0 m-0 min-vh-100">
        <RouterView />
      </main>
    </div>
  </div>

</template>

<style lang="scss" scoped>
.sidebar {
  max-width: 250px;

  .nav-pills .nav-link {
    color: var(--bs-emphasis-color);
    border: 1px solid transparent;
    border-radius: 0.375rem;
  }

  .nav-pills .nav-link:not(.active):hover {
    color: var(--bs-emphasis-color);
    background-color: var(--bs-tertiary-bg);
    border: 1px solid #0d6efd;
    border-radius: 0.375rem;
  }
}
</style>