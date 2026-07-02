// Mock data for the Aporia UI prototype.
// Mirrors the shape of the real user model (agent/memory/user-model-schema.md)
// closely enough to drive the four-mode shell without a backend.

export type Accent = "coral" | "amber" | "sage" | "sky" | "plum";

export const accentClasses: Record<
  Accent,
  { text: string; bg: string; soft: string; ring: string; dot: string }
> = {
  coral: {
    text: "text-coral",
    bg: "bg-coral",
    soft: "bg-coral-soft",
    ring: "ring-coral",
    dot: "bg-coral",
  },
  amber: {
    text: "text-amber",
    bg: "bg-amber",
    soft: "bg-amber-soft",
    ring: "ring-amber",
    dot: "bg-amber",
  },
  sage: {
    text: "text-sage",
    bg: "bg-sage",
    soft: "bg-sage-soft",
    ring: "ring-sage",
    dot: "bg-sage",
  },
  sky: {
    text: "text-sky",
    bg: "bg-sky",
    soft: "bg-sky-soft",
    ring: "ring-sky",
    dot: "bg-sky",
  },
  plum: {
    text: "text-plum",
    bg: "bg-plum",
    soft: "bg-plum-soft",
    ring: "ring-plum",
    dot: "bg-plum",
  },
};

export const LEVEL_LABELS = [
  "Novice",
  "Fluent",
  "Proficient",
  "Expert",
  "Researcher",
] as const;

export type Highlight = {
  id: string;
  text: string;
  source: string;
  note?: string;
};

export type ReviewCard = {
  id: string;
  concept: string;
  prompt: string;
  answer: string;
  daysOverdue: number;
};

export type Topic = {
  slug: string;
  name: string;
  accent: Accent;
  level: number; // 1-5
  xp: number;
  lastSession: string;
  dueReviews: number;
  summary: string;
  highlights: Highlight[];
  reviews: ReviewCard[];
};

export const topics: Topic[] = [
  {
    slug: "diffusion-models",
    name: "Diffusion Models",
    accent: "coral",
    level: 3,
    xp: 740,
    lastSession: "2 days ago",
    dueReviews: 2,
    summary:
      "Diffusion models generate data by learning to reverse a gradual noising process. The **forward process** slowly corrupts data into pure noise over many steps; a neural network is then trained to predict and remove that noise step by step. At sampling time you start from noise and iteratively denoise to produce a coherent sample.\n\nThe key insight is that predicting the *noise* added at each step is an easier learning target than predicting the clean data directly, and it connects elegantly to score matching — the model is effectively learning the gradient of the data distribution.",
    highlights: [
      {
        id: "h1",
        text: "Predicting the noise added at each step is a more stable training target than predicting the denoised image directly.",
        source: "Ho et al., DDPM (2020)",
        note: "This is the crux of why DDPM trains well.",
      },
      {
        id: "h2",
        text: "The forward process has no learned parameters — it's a fixed schedule of Gaussian noise.",
        source: "Ho et al., DDPM (2020)",
      },
      {
        id: "h3",
        text: "Sampling is slow because it requires many sequential denoising steps; this motivated later work on distillation and consistency models.",
        source: "Agent explanation",
      },
    ],
    reviews: [
      {
        id: "r1",
        concept: "Forward process",
        prompt:
          "In a diffusion model, does the forward (noising) process have learnable parameters?",
        answer:
          "No. The forward process is a fixed schedule that progressively adds Gaussian noise. Only the reverse (denoising) network is trained.",
        daysOverdue: 3,
      },
      {
        id: "r2",
        concept: "Training target",
        prompt: "What does the network actually learn to predict at each step?",
        answer:
          "The noise that was added at that step (epsilon), rather than the clean data directly — a more stable objective connected to score matching.",
        daysOverdue: 1,
      },
    ],
  },
  {
    slug: "attention",
    name: "Attention & Transformers",
    accent: "sky",
    level: 4,
    xp: 1620,
    lastSession: "Yesterday",
    dueReviews: 0,
    summary:
      "Attention lets a model weigh the relevance of every token to every other token when building a representation. **Self-attention** computes queries, keys, and values from the same sequence; the dot product of queries and keys produces attention weights that determine how much each token contributes.\n\nTransformers stack these attention layers with feed-forward networks, dropping recurrence entirely — which is what makes them so parallelizable and scalable.",
    highlights: [
      {
        id: "h1",
        text: "Attention weights are just a softmax over scaled query-key dot products.",
        source: "Vaswani et al., Attention Is All You Need (2017)",
      },
      {
        id: "h2",
        text: "Removing recurrence is what unlocked large-scale parallel training.",
        source: "Agent explanation",
      },
    ],
    reviews: [],
  },
  {
    slug: "crispr",
    name: "CRISPR Gene Editing",
    accent: "sage",
    level: 2,
    xp: 320,
    lastSession: "5 days ago",
    dueReviews: 4,
    summary:
      "CRISPR-Cas9 is a system bacteria evolved to defend against viruses, repurposed as a precise gene-editing tool. A **guide RNA** directs the Cas9 protein to a matching DNA sequence, where it makes a cut. The cell's own repair machinery then either disables the gene or, with a supplied template, rewrites it.",
    highlights: [
      {
        id: "h1",
        text: "The guide RNA is what gives CRISPR its programmability — swap the guide, target a different gene.",
        source: "Doudna & Charpentier (2012)",
        note: "The whole reason it's so flexible.",
      },
    ],
    reviews: [
      {
        id: "r1",
        concept: "Guide RNA",
        prompt: "What determines which DNA sequence Cas9 cuts?",
        answer:
          "The guide RNA — it base-pairs with a matching DNA sequence, directing Cas9 to that exact site.",
        daysOverdue: 6,
      },
    ],
  },
  {
    slug: "black-holes",
    name: "Black Hole Thermodynamics",
    accent: "plum",
    level: 1,
    xp: 90,
    lastSession: "1 week ago",
    dueReviews: 1,
    summary:
      "Black holes aren't just gravitational sinks — they have a temperature and an entropy. **Hawking radiation** means they slowly emit particles and evaporate. The entropy of a black hole is proportional to the area of its event horizon, not its volume, which is a startling hint about how information works in our universe.",
    highlights: [],
    reviews: [
      {
        id: "r1",
        concept: "Bekenstein-Hawking entropy",
        prompt: "A black hole's entropy is proportional to what?",
        answer:
          "The area of its event horizon — not its volume. This is the foundation of the holographic principle.",
        daysOverdue: 2,
      },
    ],
  },
];

// A sample Learn-mode conversation with a source in play.
export type ChatMessage = {
  id: string;
  role: "agent" | "user";
  content: string;
};

export const sampleConversation: ChatMessage[] = [
  {
    id: "m1",
    role: "agent",
    content:
      "We're looking at the DDPM paper. Before I explain anything — when you hear that a diffusion model \"adds noise then removes it,\" what do you imagine is actually being learned? Take a guess, even a rough one.",
  },
  {
    id: "m2",
    role: "user",
    content:
      "Maybe it learns what the clean image should look like, so it can undo the noise?",
  },
  {
    id: "m3",
    role: "agent",
    content:
      "That's the intuitive guess, and it's close — but there's a subtle twist that makes the whole thing work. The network doesn't predict the clean image directly. Instead, at each step it predicts the noise that was added. Reconstructing the clean data is then just subtraction.\n\nWhy do you think predicting the noise might be an easier target than predicting the clean image?",
  },
];

export const samplePaper = {
  title: "Denoising Diffusion Probabilistic Models",
  authors: "Jonathan Ho, Ajay Jain, Pieter Abbeel",
  venue: "NeurIPS 2020 · arXiv:2006.11239",
  sections: [
    {
      heading: "Abstract",
      body: "We present high quality image synthesis results using diffusion probabilistic models, a class of latent variable models inspired by considerations from nonequilibrium thermodynamics. Our best results are obtained by training on a weighted variational bound designed according to a novel connection between diffusion probabilistic models and denoising score matching with Langevin dynamics.",
    },
    {
      heading: "1. Introduction",
      body: "Deep generative models of all kinds have recently exhibited high quality samples in a wide variety of data modalities. A diffusion probabilistic model is a parameterized Markov chain trained using variational inference to produce samples matching the data after finite time. Transitions of this chain are learned to reverse a diffusion process, which is a Markov chain that gradually adds noise to the data in the opposite direction of sampling until signal is destroyed.",
    },
    {
      heading: "2. Background",
      body: "Diffusion models are latent variable models of the form p(x0) = ∫ p(x0:T) dx1:T, where x1..xT are latents of the same dimensionality as the data x0. The joint distribution is called the reverse process, and it is defined as a Markov chain with learned Gaussian transitions starting at a standard normal prior.",
    },
  ],
};
