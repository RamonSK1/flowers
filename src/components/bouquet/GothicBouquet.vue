
<template>
  <svg
    class="gothic-bouquet"
    viewBox="0 0 500 650"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Buquê de lírios-aranha e hibiscos em vaso gótico preto e rosa"
  >
    <defs>
      <linearGradient id="vase-gradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#493040" />
        <stop offset="45%" stop-color="#17101d" />
        <stop offset="100%" stop-color="#09070d" />
      </linearGradient>

      <radialGradient id="petal-gradient">
        <stop offset="0%" stop-color="#ffb4d1" />
        <stop offset="100%" stop-color="#bd3f7b" />
      </radialGradient>

      <filter id="pink-glow">
        <feGaussianBlur stdDeviation="5" />
      </filter>
    </defs>

    <!-- FLORES E CAULES -->
    <g class="bouquet-plants">
      <g class="stems">
        <path d="M250 490 Q175 360 135 180" />
        <path d="M250 490 Q235 330 245 125" />
        <path d="M250 490 Q325 355 365 190" />
        <path d="M250 490 Q175 405 105 310" />
        <path d="M250 490 Q315 400 395 315" />
      </g>

      <!-- Folhas -->

        <!-- Folhas conectadas aos caules -->
        <g class="leaves">
          <!-- Ramo esquerdo -->
          <g transform="translate(205 390) rotate(-25)">
            <path class="leaf-branch" d="M0 0 Q-18 -25 -42 -45" />
            <path
              d="M-42 -45
                 Q-72 -75 -83 -48
                 Q-66 -25 -42 -45Z"
            />
          </g>
      
          <!-- Ramo direito -->
          <g transform="translate(295 390) rotate(25)">
            <path class="leaf-branch" d="M0 0 Q18 -25 42 -45" />
            <path
              d="M42 -45
                 Q72 -75 83 -48
                 Q66 -25 42 -45Z"
            />
          </g>
      
          <!-- Folha inferior esquerda -->
          <g transform="translate(222 455) rotate(-15)">
            <path class="leaf-branch" d="M0 0 Q-24 -20 -40 -28" />
            <path
              d="M-40 -28
                 Q-85 -54 -92 -20
                 Q-64 -7 -40 -28Z"
            />
          </g>
      
          <!-- Folha inferior direita -->
          <g transform="translate(278 455) rotate(15)">
            <path class="leaf-branch" d="M0 0 Q24 -20 40 -28" />
            <path
              d="M40 -28
                 Q85 -54 92 -20
                 Q64 -7 40 -28Z"
            />
          </g>
        </g>


      <!-- Hibiscos -->
      <g class="hibiscus flower" transform="translate(135 180)">
        <path
          v-for="i in 5"
          :key="i"
          d="M0 0 Q-48 -58 0 -85 Q48 -58 0 0"
          :transform="`rotate(${(i - 1) * 72})`"
        />
        <circle r="13" class="flower-center" />
        <path d="M0 0 Q-12 -25 -15 -55" class="stamen" />
      </g>

      <g class="hibiscus flower" transform="translate(365 190)">
        <path
          v-for="i in 5"
          :key="i"
          d="M0 0 Q-45 -55 0 -78 Q45 -55 0 0"
          :transform="`rotate(${(i - 1) * 72})`"
        />
        <circle r="12" class="flower-center" />
        <path d="M0 0 Q-12 -25 -15 -50" class="stamen" />
      </g>

      
        <!-- Lírio-aranha central -->
        <g class="spider-lily flower" transform="translate(245 125)">
          <!-- Pétalas estreitas e recurvadas -->
          <g class="lily-petals">
            <path
              v-for="i in 6"
              :key="i"
              d="M0 0
                 C-8 -18 -22 -35 -16 -53
                 C-10 -70 7 -83 22 -78
                 C37 -73 36 -57 26 -48"
              :transform="`rotate(${(i - 1) * 60})`"
            />
          </g>
      
          <!-- Estames longos e arqueados -->
          <g class="lily-stamens">
            <g
              v-for="i in 8"
              :key="i"
              :transform="`rotate(${(i - 1) * 45})`"
            >
              <path
                d="M0 0 C-10 -25 -27 -53 -44 -66"
                class="lily-stamen"
              />
              <ellipse
                cx="-44"
                cy="-66"
                rx="2"
                ry="4"
                class="lily-anther"
              />
            </g>
          </g>
      
          <circle r="5" class="lily-center" />
        </g>

        <!-- Lírio-aranha esquerdo -->
        <g
          class="spider-lily flower"
          transform="translate(105 310) rotate(-18) scale(.72)"
        >
          <g class="lily-petals">
            <path
              v-for="i in 6"
              :key="i"
              d="M0 0
                 C-8 -18 -22 -35 -16 -53
                 C-10 -70 7 -83 22 -78
                 C37 -73 36 -57 26 -48"
              :transform="`rotate(${(i - 1) * 60})`"
            />
          </g>
      
          <g class="lily-stamens">
            <g
              v-for="i in 8"
              :key="i"
              :transform="`rotate(${(i - 1) * 45})`"
            >
              <path
                d="M0 0 C-10 -25 -27 -53 -44 -66"
                class="lily-stamen"
              />
              <ellipse cx="-44" cy="-66" rx="2" ry="4" class="lily-anther" />
            </g>
          </g>
      
          <circle r="5" class="lily-center" />
        </g>

        <!-- Lírio-aranha direito -->
        <g
          class="spider-lily flower"
          transform="translate(395 315) rotate(20) scale(.75)"
            >
              <g class="lily-petals">
                <path
                  v-for="i in 6"
                  :key="i"
                  d="M0 0
                     C-8 -18 -22 -35 -16 -53
                     C-10 -70 7 -83 22 -78
                     C37 -73 36 -57 26 -48"
                  :transform="`rotate(${(i - 1) * 60})`"
                />
              </g>
          
              <g class="lily-stamens">
                <g
                  v-for="i in 8"
                  :key="i"
                  :transform="`rotate(${(i - 1) * 45})`"
                >
                  <path
                    d="M0 0 C-10 -25 -27 -53 -44 -66"
                    class="lily-stamen"
                  />
                  <ellipse cx="-44" cy="-66" rx="2" ry="4" class="lily-anther" />
                </g>
              </g>
          
          
          <circle r="5" class="lily-center" />
          </g>
</g>
    <!-- VASO GÓTICO -->
    <g class="gothic-vase">
      <ellipse
        cx="250"
        cy="490"
        rx="100"
        ry="20"
        fill="#241320"
        stroke="#e8a0bb"
        stroke-width="3"
      />

      <path
        d="M155 490 L345 490 L320 610 Q250 645 180 610Z"
        fill="url(#vase-gradient)"
        stroke="#e8a0bb"
        stroke-width="3"
      />

      <path
        d="M180 525 Q250 550 320 525"
        fill="none"
        stroke="#b83e78"
        stroke-width="2"
      />

      <path
        d="M190 590 Q250 625 310 590"
        fill="none"
        stroke="#b83e78"
        stroke-width="2"
      />

      <!-- Ornamento central -->
      <path
        d="M250 535
           C225 510 205 545 250 575
           C295 545 275 510 250 535Z"
        fill="#b83e78"
        stroke="#f3d4df"
        stroke-width="2"
      />

      <path
        d="M250 510 L250 590 M225 550 L275 550"
        stroke="#e8a0bb"
        stroke-width="1"
        opacity=".5"
      />
    </g>
  </svg>
</template>

<style scoped>
.gothic-bouquet {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

.stems path {
  fill: none;
  stroke: #58735b;
  stroke-width: 7;
  stroke-linecap: round;
}

.leaves path {
  fill: #46634e;
  stroke: #799478;
  stroke-width: 2;
}

.hibiscus > path:not(.stamen) {
  fill: url(#petal-gradient);
  stroke: #ffd0e0;
  stroke-width: 2;
}

.flower-center {
  fill: #f8d29c;
}

.stamen {
  fill: none;
  stroke: #ffe2b3;
  stroke-width: 4;
  stroke-linecap: round;
}


/* Pétalas delicadas do lírio-aranha */
.lily-petals path {
  fill: none;
  stroke: #ed4b87;
  stroke-width: 5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Estames compridos */
.lily-stamen {
  fill: none;
  stroke: #ffc2d8;
  stroke-width: 1.8;
  stroke-linecap: round;
}

/* Pontas dos estames */
.lily-anther {
  fill: #ffe1aa;
}

/* Centro da flor */
.lily-center {
  fill: #f49bb8;
}


.gothic-vase {
  filter: drop-shadow(0 10px 25px rgba(0, 0, 0, .5));
}
</style>
