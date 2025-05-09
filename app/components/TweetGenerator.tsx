import { ChangeEvent, SetStateAction, useState } from 'react';
import { useChat } from 'ai/react';
import Tweet from './Tweet';
import styles from './tweetgenerator.module.css';
import Image from 'next/image';
import { FaSpinner } from 'react-icons/fa';

const TweetGenerator = () => {
  const [tweetText, setTweetText] = useState('');
  const [tone, setTone] = useState('funny');
  const [imageUrl, setImageUrl] = useState("");
  const [generateImage, setGenerateImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedTweet, setGeneratedTweet] = useState('');
  const [disableSubmitButton, setDisableSubmitButton] = useState(true);
  const [selectedImageStyle, setSelectedImageStyle] = useState("realistic");
  const [character, setCharacter] = useState('DonaldTrumph');

  const { handleInputChange, handleSubmit } = useChat({
    api: '/api/gpt',
    onFinish: (message) => {
      setError('');

      let generatedTweetContent = message.content;
      // Remove hashtags from the generated tweet
      generatedTweetContent = generatedTweetContent?.replace(/#[\w]+/g, '');
      setGeneratedTweet(generatedTweetContent);
      
      if (generateImage && generatedTweetContent) {
        getImageData(generatedTweetContent).then();
      } else {
        setLoading(false);
      }
    },
    onError: (error) => {
      setError(`An error occurred calling the OpenAI API: ${error}`);
      setLoading(false);
    }
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    handleSubmit(event);
    setDisableSubmitButton(true);
  };

  const getImageData = async (prompt: string) => {
    try {
      setLoading(true);
      // Include the selected image style in the prompt
      const styledPrompt = `${prompt} in ${selectedImageStyle} style`;
      const response = await fetch('/api/dall-e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: styledPrompt })
      });
      const { imageUrl } = await response.json();
      setImageUrl(imageUrl);
      setError('');
    } catch (error) {
      setError(`An error occurred calling the Dall-E API: ${error}`);
    }
    setLoading(false);
  };

  const handleImageCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGenerateImage(e.target.checked);
    if (!e.target.checked) setSelectedImageStyle("realistic");
  };

  const handleImageStyleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedImageStyle(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Image src="/Logo_small.png" alt="SuperViral.ai logo" width="200" height="200" />
        <h1>Generate your new post using Tweetify</h1>
      </div>
      <form className={styles.form} onSubmit={onSubmit}>
        <label htmlFor="bioInput" className={styles.label}>1. Let us know your topic or interest</label>
        <textarea
          id="bioInput"
          className={styles.textarea}
          rows={4}
          placeholder="Enter what you like & let the magic happen"
          value={tweetText}
          onChange={(e) => {
            setTweetText(e.target.value)
            handleInputChange({
              ...e,
              target: {
                ...e.target,
                value: `Generate a ${tone} post in the style of ${character} about ${e.target.value}.`}
              }
            );
            setDisableSubmitButton(false);
          }}
          disabled={loading}
        />

        <label htmlFor="vibeSelect" className={styles.label}>2. Select your response style</label>
        <select
          id="vibeSelect"
          className={styles.select}
          onChange={(e) => {
            const event = e as unknown as ChangeEvent<HTMLInputElement>;
            setTone(event.target.value);
            handleInputChange({
              ...event,
              target: {
                ...event.target,
                value: `Generate a ${e.target.value} post about ${tweetText}.`
              }
            });
            setDisableSubmitButton(false);
          }}
          disabled={loading}
        >
          <option value="funny">Funny</option>
          <option value="inspirational">Inspirational</option>
          <option value="casual">Casual</option>
        </select>

        <label htmlFor="vibeSelect" className={styles.label}>3. Select a response character</label>
        <select
          id="responseCharacterSelect"
          className={styles.select}
          value={character}
          onChange={(e) => {
            setCharacter(e.target.value);
            handleInputChange({
              target: {
                value: `Generate a ${tone} post in the style of ${e.target.value} about ${tweetText}.`
              }
            } as ChangeEvent<HTMLInputElement>);
            setDisableSubmitButton(false);
          }}
          disabled={loading}
        >
          <option value="DonaldTrumph">Donald Trump</option>
          <option value="JimCarrey">Jim Carrey</option>
          <option value="NelsonMandela">Nelson Mandela</option>
          <option value="DarthVader">Darth Vader</option>
        </select>

        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="imageOption"
            className={styles.checkbox}
            checked={generateImage}
            onChange={handleImageCheckboxChange}
            disabled={loading}
          />
          <label htmlFor="imageOption" className={styles.checkboxLabel}>Generate an image with the tweet</label>
        </div>

        {generateImage && (
          <div className={styles.imageStyleContainer}>
            <label htmlFor="imageStyleSelect" className={styles.label}>Choose Image Style</label>
            <select
              id="imageStyleSelect"
              className={styles.select}
              value={selectedImageStyle}
              onChange={handleImageStyleChange}
              disabled={loading}
            >
              <option value="realistic">Realistic</option>
              <option value="cartoon">Cartoon</option>
              <option value="abstract">Abstract</option>
              <option value="watercolor">Watercolor</option>
              <option value="digital-art">Digital Art</option>
              <option value="photographic">Photographic</option>
            </select>
          </div>
        )}

        <button className={styles.button} type="submit" disabled={disableSubmitButton || loading}>
          {loading ? 'Generating...' : 'Generate your tweet →'}
        </button>
      </form>
      {loading && (
        <div className={styles.loadingContainer}>
          <p>Loading...</p>
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
      {generatedTweet && <Tweet tweet={generatedTweet} imageSrc={imageUrl} />}
    </div>
  );
}

export default TweetGenerator;