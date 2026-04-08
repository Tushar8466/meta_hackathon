import random

class CropEnv:
    def __init__(self, dataset):
        self.dataset = dataset
        self.current_image = None
        self.current_label = None

    # 🔁 Reset environment (start new episode)
    def reset(self, difficulty="easy"):
        if difficulty == "easy":
            subset = self.dataset.data[:100]
        elif difficulty == "medium":
            subset = self.dataset.data[:500]
        else:
            subset = self.dataset.data

        # Pick random sample
        sample = random.choice(subset)

        # Get index of sample
        idx = self.dataset.data.index(sample)

        # Load image + label
        image, label = self.dataset[idx]

        # Store state
        self.current_image = image
        self.current_label = label

        return self.state()

    # 👁️ Return current observation
    def state(self):
        return self.current_image

    # ⚡ Take action and return reward
    def step(self, action, confidence=1.0):
        if action == self.current_label:
            reward = 1.0 * confidence
        else:
            reward = -1.0 * confidence

        done = True  # one-step episode

        return self.state(), reward, done, {}